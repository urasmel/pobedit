using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SharedCore.Models
{
    public class Comment
    {
        public int Id { get; set; }
        [Required]
        public Account Author { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedOrEdited;
        public bool Edited { get; set; }
        public int ReferenceToComment {  get; set; }
    }
}
