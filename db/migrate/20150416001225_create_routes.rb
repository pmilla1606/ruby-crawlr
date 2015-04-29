class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.string :waypoints
      t.string :creator

      t.timestamps null: false
    end
  end
end
