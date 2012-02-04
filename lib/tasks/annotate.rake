namespace :annotate do
  desc "annotate your models!"
  task :models => :environment do |t, args|
    exec "annotate --exclude tests,fixtures -p before"
  end
end

