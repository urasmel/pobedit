using Asp.Versioning;
using Gather.Client;
using Gather.Data;
using Gather.Services;
using Gather.Services.AccountService;
using Gather.Services.InfoService;
using Gather.Services.SearchService;
using Gather.Services.UserService;
using Gather.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SharedCore.Filtering;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1,0);
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

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddFile(@".\logs\{Date}_log.txt");
builder.Logging.AddSimpleConsole();

builder.Services.AddScoped<IdFilter>();
builder.Services.AddScoped<UserFilter>();
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Scoped);
builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        }); ;
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
var allowedOriginsForCors = "_myAllowSpecificOrigins";

var alloedHosts = builder.Configuration["AppSettings:AllowedHosts"];
if (alloedHosts == null)
{
    Console.WriteLine("There are no 'AllowedHosts' configuration in app settings");
    return;
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOriginsForCors,
        policy =>
        {
            policy.WithOrigins(alloedHosts)
            .AllowAnyMethod()
            .AllowAnyHeader();
        });
});

builder.Services.AddSingleton<IConfigUtils, ConfigUtils>();
builder.Services.AddSingleton<GatherClient>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IGatherService, GatherService>();
builder.Services.AddScoped<IInfoService, InfoService>();
builder.Services.AddScoped<ISearchService, SearchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};
app.UseWebSockets(webSocketOptions);
app.UseCors(allowedOriginsForCors);
app.UseAuthorization();
app.MapControllers();
app.Run();
