#usage: rake user:makeadmin[email@email.com]
#usage(to make not admin): rake user:makeadmin[email@email.com,true]
namespace :user do
  desc "Make user admin"
  task :makeadmin, [:user, :unmake]=>:environment do |t,args|
    args.with_defaults(:unmake=>false)
    u = User.find_by_email(args.user)
    unmake = args.unmake=="true" 

    if(u)
      if(unmake)
        u.admin=false;
        if(u.save)
          puts "Made user #{args.user} not admin"
        else
          puts "Failed to unmake user #{args.user} admin"
        end
      else
        u.admin=true;
        if(u.save)
          puts "Made user #{args.user} admin"
        else
          puts "Failed to make user #{args.user} admin"
        end
      end
    else
      puts "Can't find user #{args.user}"
    end
  end
end

