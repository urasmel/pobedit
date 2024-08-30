using ControlService.Data;
using ControlService.Services.UserService;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Asp.Versioning;
using SharedCore.Filtering;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1,0);
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("X-Api-Version"));
})
.AddMvc() // This is needed for controllers
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

var allowedOriginsForCors = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowedOriginsForCors,
        policy =>
        {
            policy.WithOrigins(builder.Configuration["AppSettings:AllowedHosts"]).AllowAnyMethod().AllowAnyHeader();
        });
});
builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddScoped<IdFilter>();
builder.Services.AddScoped<UserFilter>();
builder.Services.AddDbContext<DataContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers().ConfigureApiBehaviorOptions(options =>
{
    options.SuppressModelStateInvalidFilter = true;
}); ;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(allowedOriginsForCors);
app.UseAuthorization();
app.MapControllers();
app.Run();
