class AddStatusToSubscription < ActiveRecord::Migration
  def self.up
    add_column :subscriptions, :status, :string
  end

  def self.down
    remove_column :subscriptions, :status
  end
end
