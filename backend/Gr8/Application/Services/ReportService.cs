using Gr8.Application.DTOs;
using Gr8.Application.Interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly ICommunityRepository _communityRepository;

        public ReportService(ICommunityRepository communityRepository) 
        {
            _communityRepository = communityRepository;
        }

        public async Task<ReportDto> CreateAsync(ReportDto reportDto, string userId)
        {
            var report = new Report()
            {
                ReportedByUserId = userId,
                Reason = reportDto.Reason,
                PostId = reportDto.PostId,
                CommentId = reportDto.CommentId,
                Description = reportDto.Description,
                Status = "Pending"
            };

            await _communityRepository.AddReportAsync(report);
            var result = await _communityRepository.SaveChangesAsync();

            if (result <= 0)
            {
                return null;
            }

            return reportDto;
        }
    }
}
