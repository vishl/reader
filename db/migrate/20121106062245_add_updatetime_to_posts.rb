class AddUpdatetimeToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :updatetime, :datetime
    add_index :posts, :updatetime, :order=>{:updatetime=>:desc}
  end

  def self.down
    remove_index :posts, :updatetime
    remove_column :posts, :updatetime
  end
end
