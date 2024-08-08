using GatherMicroservice.Client;
using GatherMicroservice.Data;
using GatherMicroservice.Services;
using GatherMicroservice.Services.InfoService;
using GatherMicroservice.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Singleton);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "GatherService API",
        Description = "An ASP.NET Core Web API for gathering telegram info",
        TermsOfService = new Uri("https://pobedit.ru"),
        Contact = new OpenApiContact
        {
            Name = "Author Contact",
            Url = new Uri("https://pobedit.ru/contact")
        },
        License = new OpenApiLicense
        {
            Name = "Pobedit License",
            Url = new Uri("https://pobedit.ru/license")
        }
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

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddFile(@".\logs\{Date}_log.txt");

builder.Services.AddSingleton<IConfigUtils, ConfigUtils>();
builder.Services.AddSingleton<GatherClient>();
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
