using FirebaseAdmin.Messaging;
using Gr8.Application.Interfaces;

// This file defines the FirebasePushService class, which implements the IFirebasePushService interface.

namespace Gr8.Infrastructure.Services
{
    public class FirebasePushService : IFirebasePushService
    {
        private readonly ICommunityRepository _communityRepository;

        public FirebasePushService(ICommunityRepository communityRepository)
        {
            _communityRepository = communityRepository;
        }

        public async Task SendToUserAsync(string userId, string title, string body)
        {
            var tokens = await _communityRepository.GetFirebaseTokensByUserIdAsync(userId);

            foreach (var firebaseToken in tokens)
            {
                try
                {
                    var message = new Message
                    {
                        Token = firebaseToken.Token,
                        Data = new Dictionary<string, string>
                        //Notification = new Notification
                        {
                            ["Title"] = title,
                            ["Body"] = body
                        }
                    };

                    await FirebaseMessaging.DefaultInstance.SendAsync(message);
                }
                catch (FirebaseMessagingException ex)
                {
                    if (ex.MessagingErrorCode == MessagingErrorCode.Unregistered)
                    {
                        await _communityRepository.RemoveFirebaseTokenAsync(firebaseToken);

                        await _communityRepository.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
