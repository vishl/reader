class AddForumIdToPost < ActiveRecord::Migration
  def self.up
    add_column :posts, :forum_id, :integer
    add_index :posts, :forum_id
  end

  def self.down
    remove_index :posts, :forum_id
    remove_column :posts, :forum_id
  end
end
