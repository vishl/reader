namespace :post do
  task :add_updatetime, []=>:environment do |t,args|
    count = 0;
    Post.where("updatetime is null").find_each do |p|
      count+=1
      c = p.comments.order("updated_at desc").first
      if(c)
        p.update_attribute(:updatetime, c.updated_at)
      else
        p.update_attribute(:updatetime, p.updated_at)
      end
    end
    puts "Updated times to #{count} posts"
  end
end
