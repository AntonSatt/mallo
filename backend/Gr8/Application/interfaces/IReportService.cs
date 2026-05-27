using Gr8.Application.DTOs;

namespace Gr8.Application.Interfaces
{
    public interface IReportService
    {
        Task<ReportDto> CreateAsync(ReportDto reportDto, string userId);
    }
}
