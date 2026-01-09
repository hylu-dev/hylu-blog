{
  description = "Development environment for hylu-blog";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = [
            pkgs.hugo
            pkgs.git
          ];

          shellHook = ''
            echo "🚀 Hugo Development Environment"
            echo "Hugo version: $(hugo version)"
          '';
        };
      });
}
