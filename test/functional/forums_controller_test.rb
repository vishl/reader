require 'test_helper'

class ForumsControllerTest < ActionController::TestCase
  test "should get spawn" do
    get :spawn
    assert_response :success
  end

  test "should get show" do
    get :show
    assert_response :success
  end

end
