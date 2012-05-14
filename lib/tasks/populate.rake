namespace :db do
  desc "Fill database with sample data"
  task :populate => :environment do
    reset_db
    users = [create_user("Vishal", "vparikh1@gmail.com")]
    users += create_users(2)
    boards = create_boards(2, users[0..1])
    create_posts(boards, users[0..1], 20)
    create_comments(boards, users[0..1], 2)

    puts "done."
  end
end

def alpha(n)
  index=('A'..'J').to_a
  ret = ""
  n=Integer(n)
  loop do
    ret = index[n%10] + ret
    n/=10
    break if n==0
  end
  ret
end


def reset_db
    Rake::Task['db:reset'].invoke
end


def create_user(name, email)
  User.create!(:name=>name, :email=>email, :password=>"password", :reminder_day=>"Never")
end

def create_users(count)
  users = []
  count.times {|i|users << create_user("user#{alpha(i)}", "user#{i}@email.com")}
  return users
end

def create_boards(count, users)
  boards = []
  count.times do |i|
    b = Forum.create!(:title=>"Forum#{i}")
    users.each do |u|
      s = Subscription.new
      s.user_id=u.id
      s.forum_id=b.id
      s.save!
    end
    boards << b
  end
  return boards
end

def create_posts(boards, users, count)
  k=0
  boards.each do |b|
    count.times do |i|
      users.each do |u|
        p = Post.new(:content=>"Post content #{k}", :comment=>"Post comment #{k}")
        p.forum_id = b.id
        p.user_id=u.id
        p.save!
        p.updated_at+=k.minutes;
        p.save!
        b.make_markers_for(p)
        k+=1
      end
    end
  end
  return nil
end

def create_comments(boards, users, count)
  k=0
  boards.each do |b|
    b.posts.each do |p|
      users.each do |u|
        count.times do |i|
          c = Comment.new(:content=>"Comment content #{k}")
          c.post_id = p.id
          c.user_id=u
          c.save!
          #p.reset_markers
          k+=1
        end
      end
    end
  end
  return nil
end

    


