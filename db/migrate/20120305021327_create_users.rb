class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :encrypted_password
      t.string :salt
      t.boolean :admin
      t.string :sid

      t.timestamps
    end

    add_index :users, :email, :unique=>true
    add_index :users, :sid, :unique=>true
  end

  def self.down
    remove_index :users, :sid
    remove_index :users, :email
    drop_table :users
  end
end
