class AddUserIdToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :user_id, :integer
    add_index :posts, :user_id
  end

  def self.down
    remove_index :posts, :user_id
    remove_column :posts, :user_id
  end
end
