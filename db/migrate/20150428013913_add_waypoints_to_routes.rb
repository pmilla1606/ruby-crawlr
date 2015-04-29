class AddWaypointsToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :waypoint_id, :string
    add_column :routes, :string, :string
  end
end
