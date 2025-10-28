# Seer UI

UI for localhost visualisation of transaction traces generated using Seer. 

Part of the **Seer** submission for the **Colosseum Cypherpunk Hackathon**.
For a project overview, see the main repository: [seer](https://github.com/VasilyGerrans/seer).

## Usage

### With CLI installation (recommended)
1. Build the Docker image
    ```bash
    ./docker-build.sh
    ```
2. Install the `seer run` command to your system:
    ```bash
    sudo ./install-cli.sh
    ```
3. Reopen your terminal to apply changes.
4. Navigate to your Solana program project folder and run:
    ```bash
    seer run
    ```

### Without CLI
1. Build the Docker image
    ```bash
    ./docker-build.sh
    ```
2. Run the UI by specifying the project path:
    ```bash
    ./docker-run.sh <path_to_project>
    ```

    Replace <path_to_project> with the path to your Solana program project folder, for example:

    ```bash
    ./docker-run.sh ../demo
    ```

### Uninstall & Cleanup
To uninstall the CLI command and clean up Docker resources, run:

```bash
./uninstall.sh
```
