namespace :user do
  desc "Send reminder emails"
  task :email_reminders, []=>:environment do |t,args|
#    days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
#    t = Time.now.utc.hour
#    d = days[Time.now.wday] #TODO not UTC here because that might screw up day selection for US ppl
#
#    u = User.where(:reminder_day=>d, :reminder_time=>t)
#    u.find_each

  end
end

