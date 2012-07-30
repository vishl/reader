class AddTokenIndexToUsers < ActiveRecord::Migration
  def self.up
    add_index :users, :reset_token, :unique=>true
  end

  def self.down
    remove_index :users, :reset_token
  end
end
