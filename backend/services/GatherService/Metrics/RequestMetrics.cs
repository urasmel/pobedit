using OpenTelemetry.Metrics;
//using Prometheus;
using System.Diagnostics.Metrics;

public class RequestMetrics
{
    private readonly Counter<int> _requestsCounter;
    private readonly Histogram<double> _durationHistogram;

    public RequestMetrics(IMeterFactory meterFactory)
    {
        var meter = meterFactory.Create("Request.Metrics");

        // Метрика для подсчёта количества запросов
        _requestsCounter = meter.CreateCounter<int>("http.requests.count",
            description: "Количество обработанных HTTP-запросов");

        // Метрика для измерения времени обработки запросов
        _durationHistogram = meter.CreateHistogram<double>("http.requests.duration.seconds",
            description: "Время обработки HTTP-запросов в секундах"
            );
    }

    public void RecordRequest(string path, double durationSeconds)
    {
        _requestsCounter.Add(1, new KeyValuePair<string, object?>("path", path));
        _durationHistogram.Record(durationSeconds, new KeyValuePair<string, object?>("path", path));
    }
}