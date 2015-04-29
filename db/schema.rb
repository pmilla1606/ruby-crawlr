# encoding: UTF-8
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
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150429013642) do

  create_table "routes", force: :cascade do |t|
    t.string   "waypoints"
    t.string   "creator"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "waypoint_id"
    t.string   "string"
    t.string   "name"
  end

  create_table "users", force: :cascade do |t|
    t.string   "create_routes"
    t.string   "starred_routes"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "waypoints", force: :cascade do |t|
    t.string   "waypoint_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

end
