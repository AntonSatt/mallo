using Gr8.Application.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Gr8.Infrastructure.Identity
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly JwtSettings _jwtSettings;

        public JwtTokenGenerator(JwtSettings jwtSettings)
        {
            _jwtSettings = jwtSettings;
        }

        /// <summary>
        /// Generates a JSON Web Token (JWT) containing the specified user identifier and email address as claims.
        /// </summary>
        /// <remarks>The generated token is valid for the duration specified in the JWT settings and can
        /// be used for authenticating the user in subsequent requests. Ensure that the provided user identifier and
        /// email are valid and correspond to an authenticated user.</remarks>
        /// <param name="userId">The unique identifier of the user to include in the token's subject claim. Cannot be null or empty.</param>
        /// <param name="email">The email address of the user to include in the token's email claim. Cannot be null or empty.</param>
        /// <param name="username">The username of the user to include in the token's preferred username claim. Cannot be null or empty.</param>
        /// <returns>A string representation of the generated JWT. The token includes the user identifier, email, and username as claims and
        /// is signed using the configured security key.</returns>
        public string GenerateToken(string userId, string email, string username, int avatar = 1)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.PreferredUsername, username),
                new Claim(JwtRegisteredClaimNames.Picture, avatar.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
