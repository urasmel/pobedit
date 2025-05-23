﻿// <auto-generated />
using System;
using Gather.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Gather.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20250519091921_InitialMigration")]
    partial class InitialMigration
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.12")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("AccountChannel", b =>
                {
                    b.Property<long>("SubscribersId")
                        .HasColumnType("bigint");

                    b.Property<long>("SubscriptionChannelsId")
                        .HasColumnType("bigint");

                    b.HasKey("SubscribersId", "SubscriptionChannelsId");

                    b.HasIndex("SubscriptionChannelsId");

                    b.ToTable("AccountChannel");
                });

            modelBuilder.Entity("AccountGroup", b =>
                {
                    b.Property<long>("SubscribersId")
                        .HasColumnType("bigint");

                    b.Property<long>("SubscriptionGroupsId")
                        .HasColumnType("bigint");

                    b.HasKey("SubscribersId", "SubscriptionGroupsId");

                    b.HasIndex("SubscriptionGroupsId");

                    b.ToTable("AccountGroup");
                });

            modelBuilder.Entity("Gather.Models.Account", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint")
                        .HasAnnotation("Relational:JsonPropertyName", "id");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Bio")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "bio");

                    b.Property<string>("FirstName")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "first_name");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("boolean")
                        .HasAnnotation("Relational:JsonPropertyName", "is_active");

                    b.Property<bool?>("IsBot")
                        .HasColumnType("boolean")
                        .HasAnnotation("Relational:JsonPropertyName", "is_bot");

                    b.Property<string>("LastName")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "last_name");

                    b.Property<string>("MainUsername")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "main_username");

                    b.Property<string>("Phone")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "phone");

                    b.Property<string>("Photo")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "photo");

                    b.Property<long?>("TlgId")
                        .HasColumnType("bigint")
                        .HasAnnotation("Relational:JsonPropertyName", "tlg_id");

                    b.Property<string>("Username")
                        .HasColumnType("text")
                        .HasAnnotation("Relational:JsonPropertyName", "username");

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("Gather.Models.Channel", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("About")
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .HasColumnType("text");

                    b.Property<string>("MainUsername")
                        .HasColumnType("text");

                    b.Property<long?>("OwnerId")
                        .HasColumnType("bigint");

                    b.Property<int>("ParticipantsCount")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<long>("TlgId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Channels");
                });

            modelBuilder.Entity("Gather.Models.Comment", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<long?>("FromId")
                        .HasColumnType("bigint");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("PeerId")
                        .HasColumnType("bigint");

                    b.Property<long>("PostId")
                        .HasColumnType("bigint");

                    b.Property<long>("TlgId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("FromId");

                    b.HasIndex("PostId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("Gather.Models.Group", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("About")
                        .HasColumnType("text");

                    b.Property<string>("Image")
                        .HasColumnType("text");

                    b.Property<string>("MainUsername")
                        .HasColumnType("text");

                    b.Property<long?>("OwnerId")
                        .HasColumnType("bigint");

                    b.Property<int>("ParticipantsCount")
                        .HasColumnType("integer");

                    b.Property<string>("Title")
                        .HasColumnType("text");

                    b.Property<long>("TlgId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("Gather.Models.Post", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long?>("AuthorId")
                        .HasColumnType("bigint");

                    b.Property<long?>("ChannelId")
                        .HasColumnType("bigint");

                    b.Property<long>("CommentsCount")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("Date")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("PeerId")
                        .HasColumnType("bigint");

                    b.Property<long>("TlgId")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("ChannelId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("Gather.Models.User", b =>
                {
                    b.Property<long>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("UserId"));

                    b.Property<string>("Password")
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            UserId = 1L,
                            Password = "pass",
                            PhoneNumber = "+79123456789",
                            Username = "firstUser"
                        });
                });

            modelBuilder.Entity("AccountChannel", b =>
                {
                    b.HasOne("Gather.Models.Account", null)
                        .WithMany()
                        .HasForeignKey("SubscribersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gather.Models.Channel", null)
                        .WithMany()
                        .HasForeignKey("SubscriptionChannelsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AccountGroup", b =>
                {
                    b.HasOne("Gather.Models.Account", null)
                        .WithMany()
                        .HasForeignKey("SubscribersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gather.Models.Group", null)
                        .WithMany()
                        .HasForeignKey("SubscriptionGroupsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Gather.Models.Channel", b =>
                {
                    b.HasOne("Gather.Models.Account", "Owner")
                        .WithMany("Channels")
                        .HasForeignKey("OwnerId");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Gather.Models.Comment", b =>
                {
                    b.HasOne("Gather.Models.Account", "From")
                        .WithMany()
                        .HasForeignKey("FromId");

                    b.HasOne("Gather.Models.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .HasPrincipalKey("TlgId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("From");

                    b.Navigation("Post");
                });

            modelBuilder.Entity("Gather.Models.Group", b =>
                {
                    b.HasOne("Gather.Models.Account", "Owner")
                        .WithMany("Groups")
                        .HasForeignKey("OwnerId");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Gather.Models.Post", b =>
                {
                    b.HasOne("Gather.Models.Account", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId");

                    b.HasOne("Gather.Models.Channel", "Channel")
                        .WithMany("Posts")
                        .HasForeignKey("ChannelId");

                    b.Navigation("Author");

                    b.Navigation("Channel");
                });

            modelBuilder.Entity("Gather.Models.Account", b =>
                {
                    b.Navigation("Channels");

                    b.Navigation("Groups");
                });

            modelBuilder.Entity("Gather.Models.Channel", b =>
                {
                    b.Navigation("Posts");
                });

            modelBuilder.Entity("Gather.Models.Post", b =>
                {
                    b.Navigation("Comments");
                });
#pragma warning restore 612, 618
        }
    }
}
