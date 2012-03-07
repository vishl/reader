class CreateSubscriptions < ActiveRecord::Migration
  def self.up
    create_table :subscriptions do |t|
      t.integer :user_id
      t.integer :forum_id

      t.timestamps
    end
    add_index :subscriptions, :user_id
    add_index :subscriptions, :forum_id
    add_index :subscriptions, [:user_id, :forum_id], :unique=>true
  end

  def self.down
    remove_index :subscriptions, [:user_id, :forum_id], :unique=>true
    remove_index :subscriptions, :forum_id
    remove_index :subscriptions, :user_id
    drop_table :subscriptions
  end
end
