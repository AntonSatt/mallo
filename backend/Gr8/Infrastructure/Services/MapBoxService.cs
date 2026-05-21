using Gr8.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Infrastructure.Services
{
    public class MapBoxService : IMapBoxService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _token;

        public MapBoxService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _token = _configuration["Mapbox:AccessToken"] ?? "";
        }
    }
}
 