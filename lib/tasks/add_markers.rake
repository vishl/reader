namespace :user do
  desc "Add markers to user posts"
  task :add_markers, []=>:environment do |t,args|
    Forum.find_each do |f|
      f.users.each do |u|
        f.posts.each do |p|
          unless(Marker.where(:user_id=>u.id, :post_id=>p.id).present?)
            Marker.create!(:user_id=>u.id, :post_id=>p.id, :forum_id=>f.id, :is_read=>true, :is_starred=>false, :is_hidden=>false)
          end
        end
      end
    end
  end
end


