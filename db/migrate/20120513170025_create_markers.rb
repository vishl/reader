class CreateMarkers < ActiveRecord::Migration
  def self.up
    create_table :markers do |t|
      t.integer :user_id
      t.integer :post_id
      t.boolean :is_read
      t.boolean :is_starred
      t.boolean :is_hidden

      t.timestamps
    end
    add_index :markers, [:user_id, :post_id]
    add_index :markers, :post_id
    add_index :markers, :is_read
    add_index :markers, :is_starred
    add_index :markers, :is_hidden
  end

  def self.down
    remove_index :markers, :is_hidden
    remove_index :markers, :is_starred
    remove_index :markers, :is_read
    remove_index :markers, :post_id
    remove_index :markers, [:user_id, :post_id]
    drop_table :markers
  end
end
