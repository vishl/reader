class AddResetTokenToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :reset_token, :string
    add_column :users, :reset_token_date, :datetime
  end

  def self.down
    remove_column :users, :reset_token_date
    remove_column :users, :reset_token
  end
end
