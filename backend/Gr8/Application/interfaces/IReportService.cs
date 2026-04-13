using Gr8.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Interfaces
{
    public interface IReportService
    {
        Task<ReportDto> CreateAsync(ReportDto reportDto, string userId);
        Task<List<ReportDto>> GetReportByAsync(string userId);
    }
}
