namespace :user do
  desc "Send reminder emails"
  task :email_reminders, []=>:environment do |t,args|
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    t = Time.now.utc.hour
    d = days[Time.now.wday] #TODO not UTC here because that might screw up day selection for US ppl
    count=0;

    users = User.where(:reminder_day=>[d, "Daily"], :reminder_time=>t)
    users.find_each do |u|
      #compile a list of forums with changes
      changed = {}
      u.forums.find_each do |f|
        #posts = f.posts.where("updated_at > ?", Time.now-7.days)
        m = Marker.where(:forum_id=>f.id, :user_id=>u.id, :is_read=>false)
        posts = Post.where("id IN (?)", m.map{|k|k.post_id})
        if(posts.count>0)
          changed[f] = posts
        end
        #TODO detect comments as well
      end

      if(changed.length>0)
        Notifier.updates(u, changed).deliver
        count+=1
      end
    end

    #daily people
#    users = User.where(:reminder_day=>"Daily", :reminder_time=>t)
#    users.find_each do |u|
#      #compile a list of forums with changes
#      changed = {}
#      u.forums.find_each do |f|
#        posts = f.posts.where("updated_at > ?", Time.now-24.hours)
#        if(posts.count>0)
#          changed[f] = posts
#        end
#        #TODO detect comments as well
#      end
#
#      if(changed.length>0)
#        Notifier.updates(u, changed).deliver
#        count+=1
#      end
#    end
    puts "Sent #{count} emails"
  end
end

