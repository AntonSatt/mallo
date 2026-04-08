using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Application.interfaces
{
    public interface ICommunityRepository
    {
        Task<int> AddAsync(Post post);
    }
}
