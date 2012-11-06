# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121106062245) do

  create_table "comments", :force => true do |t|
    t.string   "name"
    t.text     "content"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  add_index "comments", ["post_id"], :name => "index_comments_on_post_id"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority"

  create_table "forums", :force => true do |t|
    t.string   "title"
    t.string   "sid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "forums", ["sid"], :name => "index_forums_on_sid"

  create_table "markers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "post_id"
    t.boolean  "is_read"
    t.boolean  "is_starred"
    t.boolean  "is_hidden"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "forum_id"
  end

  add_index "markers", ["forum_id"], :name => "index_markers_on_forum_id"
  add_index "markers", ["is_hidden"], :name => "index_markers_on_is_hidden"
  add_index "markers", ["is_read"], :name => "index_markers_on_is_read"
  add_index "markers", ["is_starred"], :name => "index_markers_on_is_starred"
  add_index "markers", ["post_id"], :name => "index_markers_on_post_id"
  add_index "markers", ["user_id", "post_id"], :name => "index_markers_on_user_id_and_post_id"

  create_table "posts", :force => true do |t|
    t.string   "name"
    t.text     "content"
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "forum_id"
    t.integer  "user_id"
    t.datetime "updatetime"
  end

  add_index "posts", ["forum_id"], :name => "index_posts_on_forum_id"
  add_index "posts", ["updatetime"], :name => "index_posts_on_updatetime"
  add_index "posts", ["user_id"], :name => "index_posts_on_user_id"

  create_table "settings", :force => true do |t|
    t.string   "var",                      :null => false
    t.text     "value"
    t.integer  "thing_id"
    t.string   "thing_type", :limit => 30
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "settings", ["thing_type", "thing_id", "var"], :name => "index_settings_on_thing_type_and_thing_id_and_var", :unique => true

  create_table "subscriptions", :force => true do |t|
    t.integer  "user_id"
    t.integer  "forum_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status"
  end

  add_index "subscriptions", ["forum_id"], :name => "index_subscriptions_on_forum_id"
  add_index "subscriptions", ["user_id", "forum_id"], :name => "index_subscriptions_on_user_id_and_forum_id", :unique => true
  add_index "subscriptions", ["user_id"], :name => "index_subscriptions_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "encrypted_password"
    t.string   "salt"
    t.boolean  "admin"
    t.string   "sid"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "reset_token"
    t.datetime "reset_token_date"
    t.string   "reminder_day"
    t.integer  "reminder_time"
    t.text     "settings"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reminder_day", "reminder_time"], :name => "index_users_on_reminder_day_and_reminder_time"
  add_index "users", ["reset_token"], :name => "index_users_on_reset_token", :unique => true
  add_index "users", ["sid"], :name => "index_users_on_sid", :unique => true

end
