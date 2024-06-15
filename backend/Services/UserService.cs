using System.Collections.Generic;
using System.Linq;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;

            
            if (!_context.Users.Any())
            {
                _context.Users.AddRange(
                    new User { Id = 1, Name = "John Doe", Email = "john@gmail.com" },
                    new User { Id = 2, Name = "Jane Doe", Email = "jane@gmail.com" },
                    new User { Id = 3, Name = "Pedro", Email = "pedro@gmail.com" },
                    new User { Id = 4, Name = "Jorge", Email = "jorge@gmail.com" },
                    new User { Id = 5, Name = "Caio", Email = "caio@gmail.com" }
                    
                );
                _context.SaveChanges();
            }
        }

        public IEnumerable<User> GetUsers() => _context.Users.ToList();

        public User GetUser(int id) => _context.Users.Find(id);

        public void AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void UpdateUser(User updatedUser)
        {
            var existingUser = _context.Users.Find(updatedUser.Id);
            if (existingUser != null)
            {
                existingUser.Name = updatedUser.Name;
                existingUser.Email = updatedUser.Email;
                _context.SaveChanges();
            }
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        public User GetUserById(int id) => _context.Users.Find(id);
    }
}