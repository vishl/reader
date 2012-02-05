Reader::Application.routes.draw do
  root :to=>"pages#home"

  ##api
  #bookmarklet
  get "/bookmarklet", :to=>"pages#bookmarklet"
  get "/post/:sid", :as=>:post, :to=>"forums#post"

  post "/forums/spawn",  :as=>:spawn,        :to=>"forums#spawn"
  get  "/:sid",          :as=>:forum,        :to=>"forums#show"
  post "/:sid",    :as=>"post_create", :to=>"posts#create"
  post "/:sid/:id",    :as=>"comment_create", :to=>"comments#create"

  #google reader style
  #TODO
end
