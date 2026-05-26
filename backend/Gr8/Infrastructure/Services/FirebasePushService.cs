using FirebaseAdmin.Messaging;
using Gr8.Application.Interfaces;

namespace Gr8.Infrastructure.Services
{
    public class FirebasePushService : IFirebasePushService
    {
        private readonly ICommunityRepository _communityRepository;

        public FirebasePushService(ICommunityRepository communityRepository) 
        {
            _communityRepository = communityRepository;
        }

        public async Task SendToUserAsync(string userId, string Title, string body)
        {
            var tokens = await _communityRepository.GetFirebaseTokensByUserIdAsync(userId);

            foreach(var firebaseToken in tokens)
            {
                var message = new Message
                {
                    Token = firebaseToken.Token,
                    Notification = new Notification
                    {
                        Title = Title,
                        Body = body
                    }
                };

                await FirebaseMessaging.DefaultInstance.SendAsync(message);
            }
        }
    }
}
