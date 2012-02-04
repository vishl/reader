class CreateForums < ActiveRecord::Migration
  def self.up
    create_table :forums do |t|
      t.string :title
      t.string :sid

      t.timestamps
    end
    add_index :forums, :sid
  end

  def self.down
    remove_index :forums, :sid
    drop_table :forums
  end
end
