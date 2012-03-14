if Rails.env.production? && defined?(HireFire)
  HireFire.configure do |config|
    config.max_workers      = 1 
    config.min_workers = 0
    config.job_worker_ratio = [
        { :jobs => 1,   :workers => 1 },
        { :jobs => 15,  :workers => 1 },
        { :jobs => 35,  :workers => 1 },
        { :jobs => 60,  :workers => 1 },
        { :jobs => 80,  :workers => 1 }
      ]
  end
end

