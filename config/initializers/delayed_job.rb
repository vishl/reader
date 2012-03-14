#the delay is 5 + N^4 seconds, so the final delay will be about 3 hours, and
#total run time will be about 7 hours
Delayed::Worker.max_attempts = 10

#we had better not be doing anything that takes longer than this
Delayed::Worker.max_run_time = 5.minutes

#don't delay anything in test or dev
if (Rails.env.test? || Rails.env.development?)
  Delayed::Worker.delay_jobs=false
end

