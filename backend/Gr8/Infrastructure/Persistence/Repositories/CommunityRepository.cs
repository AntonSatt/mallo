using Gr8.Application.interfaces;
using Gr8.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gr8.Infrastructure.Persistence.Repositories
{
    public class CommunityRepository : ICommunityRepository
    {
        private readonly CommunityDbContext _communityDbContext;

        public CommunityRepository(CommunityDbContext communityDbContext)
        {
            _communityDbContext = communityDbContext;
        }

        public async Task<int> AddAsync(Post post)
        {
           _communityDbContext.Posts.Add(post);
           return await _communityDbContext.SaveChangesAsync();
        }
    }
}
