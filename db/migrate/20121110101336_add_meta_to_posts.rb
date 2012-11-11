class AddMetaToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :meta, :text
  end

  def self.down
    remove_column :posts, :meta
  end
end
