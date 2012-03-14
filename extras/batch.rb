#batch commands, usually run under delayed_job
module Batch

  #should be called with .delay
  def self.send_invites(addrs, user, forum)
    addrs.each do |a|
      Notifier.invite(a, user, forum).deliver;
    end
  end
end
