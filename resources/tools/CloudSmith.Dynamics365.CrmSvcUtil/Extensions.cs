using System;
using System.Diagnostics;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public static class DiagnosticExtensions
    {
        public static void LogInformation(this TraceSource ts, string message)
        {
            var type = new StackTrace(false)?.GetFrame(1)?.GetMethod()?.DeclaringType;

            ts.TraceEvent(TraceEventType.Information, 100, $"{type?.Name}: {message}");
        }

        public static void LogInformation(this TraceSource ts, string message, params object[] args)
        {
            var type = new StackTrace(false)?.GetFrame(1)?.GetMethod()?.DeclaringType;

            ts.TraceEvent(TraceEventType.Information, 100, $"{type?.Name}: {message}", args);
        }

        public static void Debug(this TraceSource ts, string message)
        {
            var type = new StackTrace(false)?.GetFrame(1)?.GetMethod()?.DeclaringType;

            ts.TraceEvent(TraceEventType.Verbose, 100, $"{type?.Name}: {message}");
        }

        public static void Debug(this TraceSource ts, string message, params object[] args)
        {
            var type = new StackTrace(false)?.GetFrame(1)?.GetMethod()?.DeclaringType;

            ts.TraceEvent(TraceEventType.Verbose, 100, $"{type?.Name}: {message}", args);
        }

        public static void LogExceptionWarning(this TraceSource ts, Exception ex)
        {
            ts.TraceEvent(TraceEventType.Warning, 100, ex.ToString());
        }
    }
}
