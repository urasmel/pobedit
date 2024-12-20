using Asp.Versioning;
using Gather.Client;
using Gather.Data;
using Gather.Services;
using Gather.Services.InfoService;
using Gather.Services.UserService;
using Gather.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using SharedCore.Filtering;
using System.Net.WebSockets;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1,0);
    options.ReportApiVersions = true;
    //options.AssumeDefaultVersionWhenUnspecified = true;
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

builder.Services.AddScoped<IdFilter>();
builder.Services.AddScoped<UserFilter>();
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Singleton);
builder.Services.AddControllers();
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
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOriginsForCors,
        policy =>
        {
            policy.WithOrigins(builder.Configuration["AppSettings:AllowedHosts"]).AllowAnyMethod().AllowAnyHeader();
        });
});

builder.Services.AddSingleton<IConfigUtils, ConfigUtils>();
builder.Services.AddSingleton<GatherClient>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILoginService, LoginService>();
builder.Services.AddScoped<IGatherService, GatherService>();
builder.Services.AddScoped<IInfoService, InfoService>();

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
