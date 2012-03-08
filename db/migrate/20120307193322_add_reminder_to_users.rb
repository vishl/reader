class AddReminderToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :reminder_day, :string
    add_column :users, :reminder_time, :integer
    add_index :users, [:reminder_day, :reminder_time]
  end

  def self.down
    remove_index :users, [:reminder_day, :reminder_time]
    remove_column :users, :reminder_time
    remove_column :users, :reminder_day
  end
end
