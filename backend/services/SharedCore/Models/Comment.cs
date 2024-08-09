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

        public int CommentId { get; set; }

        public int ChannelId {  get; set; }

        [Required]
        public Account Author { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime Date;

        public int ReplyTo {  get; set; }
    }
}
