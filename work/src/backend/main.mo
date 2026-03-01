import Int "mo:core/Int";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Comment = {
    id : Nat;
    videoId : Text;
    displayName : Text;
    body : Text;
    timestamp : Int;
  };

  module Comment {
    public func compareByTimestamp(comment1 : Comment, comment2 : Comment) : Order.Order {
      Int.compare(comment1.timestamp, comment2.timestamp);
    };
  };

  let videoComments = Map.empty<Text, [Comment]>();
  var nextId = 0;

  public shared ({ caller }) func postComment(videoId : Text, displayName : Text, body : Text) : async Nat {
    let comment : Comment = {
      id = nextId;
      videoId;
      displayName;
      body;
      timestamp = Time.now();
    };

    let existingComments = switch (videoComments.get(videoId)) {
      case (?comments) { comments };
      case (null) { [] };
    };
    videoComments.add(videoId, existingComments.concat([comment]));

    let currentId = nextId;
    nextId += 1;
    currentId;
  };

  public query ({ caller }) func getComments(videoId : Text) : async [Comment] {
    switch (videoComments.get(videoId)) {
      case (?comments) { comments.sort(Comment.compareByTimestamp) };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func deleteComment(commentId : Nat) : async Bool {
    var found = false;
    let videos = videoComments.keys().toArray();
    for (videoId in videos.values()) {
      switch (videoComments.get(videoId)) {
        case (?comments) {
          let filteredComments = comments.filter(
            func(comment) {
              if (comment.id == commentId) {
                found := true;
                return false;
              };
              true;
            }
          );
          videoComments.add(videoId, filteredComments);
        };
        case (null) { () };
      };
    };
    found;
  };

  public query ({ caller }) func getCommentCount(videoId : Text) : async Nat {
    switch (videoComments.get(videoId)) {
      case (?comments) { comments.size() };
      case (null) { 0 };
    };
  };
};
