Reader::Application.routes.draw do
  root :to=>"pages#home"

  post "/forums/spawn",  :as=>:spawn,        :to=>"forums#spawn"
  get  "/:sid",          :as=>"forum",       :to=>"forums#show"
  post "/:sid",    :as=>"post_create", :to=>"posts#create"
  post "/:sid/:id",    :as=>"comment_create", :to=>"comments#create"
end
