class AddForumIdToMarkers < ActiveRecord::Migration
  def self.up
    add_column :markers, :forum_id, :integer
    add_index :markers, :forum_id
  end

  def self.down
    remove_index :markers, :forum_id
    remove_column :markers, :forum_id
  end
end
