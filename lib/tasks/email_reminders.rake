namespace :user do
  desc "Send reminder emails"
  task :email_reminders, []=>:environment do |t,args|
    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    t = Time.now.utc.hour
    d = days[Time.now.wday] #TODO not UTC here because that might screw up day selection for US ppl
    count=0;

    #TODO we should be checking for unread here
    users = User.where(:reminder_day=>d, :reminder_time=>t)
    users.find_each do |u|
      #compile a list of forums with changes
      changed = {}
      u.forums.find_each do |f|
        posts = f.posts.where("updated_at > ?", Time.now-7.days)
        if(posts.count>0)
          changed[f] = p
        end
        #TODO detect comments as well
      end

      Notifier.updates(u, changed).deliver
      count+=1
    end

    #daily people
    users = User.where(:reminder_day=>"Daily", :reminder_time=>t)
    users.find_each do |u|
      #compile a list of forums with changes
      changed = {}
      u.forums.find_each do |f|
        posts = f.posts.where("updated_at > ?", Time.now-24.hours)
        if(posts.count>0)
          changed[f] = posts
        end
        #TODO detect comments as well
      end

      Notifier.updates(u, changed).deliver
      count+=1
    end
    puts "Sent #{count} emails"
  end
end

