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
    [Migration("20250124134824_UpdateComment")]
    partial class UpdateComment
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

            modelBuilder.Entity("SharedCore.Models.Account", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("Bio")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .HasColumnType("text");

                    b.Property<bool?>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<string>("LastName")
                        .HasColumnType("text");

                    b.Property<string>("MainUsername")
                        .HasColumnType("text");

                    b.Property<string>("Phone")
                        .HasColumnType("text");

                    b.Property<string>("Photo")
                        .HasColumnType("text");

                    b.Property<long>("TlgId")
                        .HasColumnType("bigint");

                    b.Property<string>("Username")
                        .HasColumnType("text");

                    b.Property<bool?>("isBot")
                        .HasColumnType("boolean");

                    b.HasKey("Id");

                    b.ToTable("Accounts");
                });

            modelBuilder.Entity("SharedCore.Models.Channel", b =>
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

            modelBuilder.Entity("SharedCore.Models.Comment", b =>
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

            modelBuilder.Entity("SharedCore.Models.Group", b =>
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

            modelBuilder.Entity("SharedCore.Models.Post", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long?>("AuthorId")
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

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("SharedCore.Models.User", b =>
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
                    b.HasOne("SharedCore.Models.Account", null)
                        .WithMany()
                        .HasForeignKey("SubscribersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SharedCore.Models.Channel", null)
                        .WithMany()
                        .HasForeignKey("SubscriptionChannelsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("AccountGroup", b =>
                {
                    b.HasOne("SharedCore.Models.Account", null)
                        .WithMany()
                        .HasForeignKey("SubscribersId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("SharedCore.Models.Group", null)
                        .WithMany()
                        .HasForeignKey("SubscriptionGroupsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("SharedCore.Models.Channel", b =>
                {
                    b.HasOne("SharedCore.Models.Account", "Owner")
                        .WithMany("Channels")
                        .HasForeignKey("OwnerId");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("SharedCore.Models.Comment", b =>
                {
                    b.HasOne("SharedCore.Models.Account", "From")
                        .WithMany()
                        .HasForeignKey("FromId");

                    b.HasOne("SharedCore.Models.Post", null)
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("From");
                });

            modelBuilder.Entity("SharedCore.Models.Group", b =>
                {
                    b.HasOne("SharedCore.Models.Account", "Owner")
                        .WithMany("Groups")
                        .HasForeignKey("OwnerId");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("SharedCore.Models.Post", b =>
                {
                    b.HasOne("SharedCore.Models.Account", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId");

                    b.Navigation("Author");
                });

            modelBuilder.Entity("SharedCore.Models.Account", b =>
                {
                    b.Navigation("Channels");

                    b.Navigation("Groups");
                });

            modelBuilder.Entity("SharedCore.Models.Post", b =>
                {
                    b.Navigation("Comments");
                });
#pragma warning restore 612, 618
        }
    }
}
