using Asp.Versioning;
using Gather.Client;
using Gather.Data;
using Gather.Filters;
using Gather.Middlewares;
using Gather.ServiceFactories;
using Gather.Services;
using Gather.Services.Accounts;
using Gather.Services.Channels;
using Gather.Services.Comments;
using Gather.Services.Login;
using Gather.Services.Posts;
using Gather.Services.Search;
using Gather.Services.Users;
using Gather.Utils.ConfigService;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.OpenApi.Models;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using Serilog.Sinks.Grafana.Loki;
using SharedCore.Filtering;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var apiId = builder.Configuration["Pobedit:ApiId"];
var apiHash = builder.Configuration["Pobedit:ApiHash"];
var phoneNumber = builder.Configuration["Pobedit:PhoneNumber"];
if (apiId == null || apiHash == null || phoneNumber == null)
{
    Console.WriteLine("Configuration data for the telegram account is missing");
    Log.Error("Configuration data for the telegram account is missing");
    return;
}

string OutputTemplate = "{Timestamp:dd-MM-yyyy HH:mm:ss} [{Level:u3}] [{ThreadId}] {Message}{NewLine}{Exception}";
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console(outputTemplate: OutputTemplate)
    .WriteTo.GrafanaLoki(
        uri: "http://localhost:3100",
        labels: new List<LokiLabel>
        {
            new() { Key = "service_name", Value = "GaherService" },
        },
        credentials: null)
    .Enrich.WithProperty("Application", "GaherService")
    .Enrich.WithProperty("Environment", builder.Environment.EnvironmentName)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"));
})
.AddMvc()
.AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'V";
    options.SubstituteApiVersionInUrl = true;
});

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Services.AddScoped<IdFilter>();
builder.Services.AddScoped<UserFilter>();
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Scoped);
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ApiExceptionFilter>();
})
    .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
        });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Pobedit gather API"
    });

    // using System.Reflection;
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddOpenTelemetry()
    .ConfigureResource(resourceBuilder =>
        resourceBuilder.AddService(
            serviceName: "gather-service",
            serviceVersion: "1.0.0")
            .AddTelemetrySdk()
            .AddEnvironmentVariableDetector())
    .WithMetrics(builder =>
    {
        builder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddRuntimeInstrumentation()
            // Кастомные метрики
            .AddMeter("Request.Metrics")
            .AddPrometheusExporter();
        builder.AddMeter("Microsoft.AspNetCore.Hosting", "Microsoft.AspNetCore.Server.Kestrel");
    })
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddConsoleExporter()
            .AddSource("MyApp.Tracing");
    });

var allowedOriginsForCors = "_myAllowSpecificOrigins";
var allowedHosts = builder.Configuration["AppSettings:AllowedHosts"];
if (allowedHosts == null)
{
    Console.WriteLine("There are no 'AllowedHosts' configuration in app settings");
    return;
}
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOriginsForCors,
        policy =>
        {
            policy.WithOrigins(allowedHosts)
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

builder.Services.TryAddSingleton<IGatherNotifierFabric, GatherNotifierFabric>();
builder.Services.AddSingleton<IConfigUtils>(sp =>
ConfigUtilsFactory.Create(
    apiId,
    apiHash,
    phoneNumber));

builder.Services.AddSingleton<RequestMetrics>();

builder.Services.AddSingleton<IGatherService, GatherService>();
builder.Services.AddSingleton<ISettingsService, SettingsService>();
builder.Services.AddSingleton<GatherClient>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IChannelsService, ChannelsService>();
builder.Services.AddScoped<IPostsService, PostsService>();
builder.Services.AddScoped<ICommentsService, CommentsService>();
builder.Services.AddScoped<ISearchService, SearchService>();

var app = builder.Build();

// Добавляем endpoint для метрик Prometheus
app.MapPrometheusScrapingEndpoint();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseStaticFiles(); // Make sure this is enabled
    app.UseSwagger(); 
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.InjectStylesheet("/swagger-dark.css"); // Add this line
        c.EnableTryItOutByDefault();
    });
}

app.UseOpenTelemetryPrometheusScrapingEndpoint(); // Endpoint для Prometheus /metrics
var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseWebSockets(webSocketOptions);
app.UseCors(allowedOriginsForCors);
app.UseAuthorization();
app.MapControllers();
app.Run();
